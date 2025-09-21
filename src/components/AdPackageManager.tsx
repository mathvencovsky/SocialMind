import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Package, Clock, DollarSign } from 'lucide-react';
import { useAdPackages } from '@/hooks/useAdPackages';
import { useToast } from '@/hooks/use-toast';

interface AdPackageFormData {
  title: string;
  description: string;
  price: number;
  delivery_days: number;
  includes: string[];
}

const AdPackageManager = () => {
  const { packages, loading, createPackage, updatePackage, deletePackage } = useAdPackages();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [formData, setFormData] = useState<AdPackageFormData>({
    title: '',
    description: '',
    price: 0,
    delivery_days: 7,
    includes: []
  });
  const [includesInput, setIncludesInput] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      delivery_days: 7,
      includes: []
    });
    setIncludesInput('');
    setEditingPackage(null);
  };

  const handleOpenDialog = (packageToEdit?: any) => {
    if (packageToEdit) {
      setEditingPackage(packageToEdit);
      setFormData({
        title: packageToEdit.title,
        description: packageToEdit.description,
        price: packageToEdit.price,
        delivery_days: packageToEdit.delivery_days,
        includes: packageToEdit.includes || []
      });
      setIncludesInput(packageToEdit.includes?.join('\n') || '');
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const includes = includesInput
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const packageData = {
      ...formData,
      includes
    };

    if (editingPackage) {
      await updatePackage(editingPackage.id, packageData);
    } else {
      await createPackage(packageData);
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pacote?')) {
      await deletePackage(id);
    }
  };

  const toggleActiveStatus = async (pkg: any) => {
    await updatePackage(pkg.id, { is_active: !pkg.is_active });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Pacotes Publicitários</h2>
          <p className="text-muted-foreground">
            Gerencie seus pacotes de publicidade e serviços oferecidos.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Pacote
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Editar Pacote' : 'Criar Novo Pacote'}
              </DialogTitle>
              <DialogDescription>
                Configure os detalhes do seu pacote publicitário.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título do Pacote</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Post no Feed + Stories"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o que está incluído neste pacote..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="delivery_days">Prazo (dias)</Label>
                  <Input
                    id="delivery_days"
                    type="number"
                    value={formData.delivery_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, delivery_days: parseInt(e.target.value) || 7 }))}
                    placeholder="7"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="includes">O que está incluído (um item por linha)</Label>
                <Textarea
                  id="includes"
                  value={includesInput}
                  onChange={(e) => setIncludesInput(e.target.value)}
                  placeholder="1 post no feed&#10;3 stories&#10;Hashtags otimizadas"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPackage ? 'Atualizar' : 'Criar'} Pacote
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {packages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum pacote criado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro pacote publicitário para começar a receber propostas.
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Pacote
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={!pkg.is_active ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {pkg.title}
                      {!pkg.is_active && (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={pkg.is_active}
                      onCheckedChange={() => toggleActiveStatus(pkg)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(pkg)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      R$ {pkg.price.toFixed(2)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {pkg.delivery_days} dias
                    </div>
                  </div>
                </div>
                
                {pkg.includes && pkg.includes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Incluído:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {pkg.includes.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdPackageManager;